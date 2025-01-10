grammar JobControlLanguage

entry JclProgram:
    job=JobStatement 
    exec+=ExecStatement
    (exec+=ExecStatement | dd+= DDStatement )*;

JobStatement:
    name=START
    'JOB' 
    param = JobParameters
    comment=ID?
    end=NL
    ;

JobParameters: 
    (positional = PositionalJobParams)?
    (keyword += KeywordJobParams (',' ((NL CONTINUE_STATEMENT keyword+= KeywordJobParams) | keyword+= KeywordJobParams))* );

PositionalJobParams: 
    (account = ID ',')?
    programmer = ID ',';

KeywordJobParams:
    name=('CLASS' | 'GROUP' | 'PASSWORD' | 
            'RD' | 'RESTART' | 'SCHENV' | 'SYSTEM' | 'SYSAFF' | 
            'SECLABEL' | 'TYPRUN' | 'USER') 
    '='
    value=ID;

ExecStatement:
    name=START
    'EXEC'
    param = ExecParameters
    comment=ID?
    end=NL?
    ;

ExecParameters:
    positional = PositionalExecParameter ','
    (keyword += KeywordExecParameters (',' ((NL CONTINUE_STATEMENT keyword+= KeywordExecParameters) | keyword+= KeywordExecParameters))* );    



KeywordExecParameters:
    name=(
    'COND' | 'PARM' | 'REGION' 
    )
    '='
    paramValue=ID;

PositionalExecParameter:
    (name = ('PGM' | 'PROC') '=')?
    value = ID
    ;


DDStatement:
    name=START
    'DD'
    param=(DDParameters | InlineDDParameters)
    end=NL?
    ;

DDParameters:
    positional = PositionalDDParameter ','
    (keyword += KeywordDDParameters (',' ((NL CONTINUE_STATEMENT keyword+= KeywordDDParameters) | keyword+= KeywordDDParameters))* );    


PositionalDDParameter:
    name=(
    'DATA' | 'DUMMY' | 'DYNAM'
    )
    '='
    value=ID
    ;

InlineDDParameters:
    name=('*'|'DATA')
    (NL
    value+=ID+)*;

KeywordDDParameters:
    name=(
    'DCB' | 'DISP' | 'DSN' | 'DSNAME' | 'LABEL' |
    'SPACE' | 'SYSOUT' | 'UNIT' | 'VOL' | 'VOLUME'
    )
    '='
    paramValue=ID;

terminal CONTINUE_STATEMENT: /\/\/\s{1,10}/;
terminal START: /\/\/[_a-zA-Z]{1,8}/;
terminal ID: /[_a-zA-Z][\w_]*/;
hidden terminal COMMENT: /\/\/\*.*/;
hidden terminal WS: /\s+/;
terminal NL: /\s*[\r?\n]+/;
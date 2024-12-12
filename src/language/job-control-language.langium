grammar JobControlLanguage

entry JclProgram:
    (jclStatement+=Statement)+;

Statement: job=JobStatement 
    exec=ExecStatement 
    dd+=DDStatement+ ;

JobStatement:
    start=START_STATEMENT
    name=ID
    'JOB' 
    param = JobParameters
    comment=ID?
    ;

JobParameters: 
    (positional = PositionalJobParams)?
    (keyword += KeywordJobParams (',' ((EOL CONTINUE_STATEMENT keyword+= KeywordJobParams) | keyword+= KeywordJobParams))* );

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
    EOL
    start=START_STATEMENT
    name=ID
    'EXEC'
    param = ExecParameters
    comment=ID?
    ;

ExecParameters:
    positional = PositionalExecParameter ','
    (keyword += KeywordExecParameters (',' ((EOL CONTINUE_STATEMENT keyword+= KeywordExecParameters) | keyword+= KeywordExecParameters))* );    



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
    EOL
    start=START_STATEMENT
    name=ID
    'DD'
    param=DDParameters
    ;

DDParameters:
    positional = PositionalDDParameter ','
    (keyword += KeywordDDParameters (',' ((EOL CONTINUE_STATEMENT keyword+= KeywordDDParameters) | keyword+= KeywordDDParameters))* );    


PositionalDDParameter:
    name=(
    'DATA' | 'DUMMY' | 'DYNAM'
    )
    '='
    value=ID
    ;


KeywordDDParameters:
    name=(
    'DCB' | 'DISP' | 'DSN' | 'DSNAME' | 'LABEL' |
    'SPACE' | 'SYSOUT' | 'UNIT' | 'VOL' | 'VOLUME'
    )
    '='
    paramValue=ID;


hidden terminal WS: /\s+/;
terminal CONTINUE_STATEMENT: /\/\/\s{10}/;
terminal START_STATEMENT: /\/\//;
terminal EOL: /\r?\n/;
terminal ID: /[_a-zA-Z][\w_]*/;
hidden terminal SL_COMMENT: /\/\/\*/;

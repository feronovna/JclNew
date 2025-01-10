import { DefaultLexer, LexerResult, LexingDiagnostic} from 'langium'
import type {IToken, ILexingError} from 'chevrotain'
const NEWLINE = '\n'.charCodeAt(0);

export class JclLexer extends DefaultLexer {

    override tokenize(text: string): LexerResult {
        const lines = this.splitLines(text);
        const adjustedLines = lines.map(line => this.adjustLine(line));
        const adjustedText = adjustedLines.join('');
        const chevrotainResult = this.chevrotainLexer.tokenize(adjustedText);
        const tokens: IToken[] = chevrotainResult.tokens;
        const re = new RegExp("\/\/");
        for (const token of tokens){
            if (re.test(token.image) && token.startColumn!==1){
                console.log(token.tokenType.name)
                const error: ILexingError = {
                    offset: token.startOffset,
                    line: token.startLine,
                    column : token.startColumn,
                    length: 2,
                    message: `wrong start posittion ${token.tokenType.categoryMatches}`
                }
                chevrotainResult.errors.push(error)
            }
        }
        if (this.tokenBuilder.flushLexingReport){
            const report : LexingDiagnostic[]= this.tokenBuilder.flushLexingReport(text).diagnostics;
            for (const re of report){
                re.column
            }
        }
    
        return {
            tokens: chevrotainResult.tokens,
            errors: chevrotainResult.errors,
            hidden: chevrotainResult.groups.hidden ?? [],
            report: this.tokenBuilder.flushLexingReport?.(text)
        };
    }
   
    private splitLines(text: string): string[] {
        const lines: string[] = [];
        for (let i = 0; i < text.length; i++) {
            const start = i;
            while (i < text.length && text.charCodeAt(i) !== NEWLINE) {
                i++;
            }
            lines.push(text.substring(start, i + 1));
        }
        return lines;
    }

    private adjustLine(line: string): string {
        let eol = '';
        if (line.endsWith('\r\n')) {
            eol = '\r\n';
        } else if (line.endsWith('\n')) {
            eol = '\n';
        }
        const prefixLength = 0;
        const lineLength = line.length - eol.length;
        if (lineLength < prefixLength) {
            return ' '.repeat(lineLength) + eol;
        }
        const lineEnd = 71;
        const prefix = ' '.repeat(prefixLength);
        let postfix = '';
        if (lineLength > lineEnd) {
            postfix = ' '.repeat(lineLength - lineEnd);
        }
        return prefix + line.substring(prefixLength, Math.min(lineEnd, lineLength)) + postfix + eol;
    }

}


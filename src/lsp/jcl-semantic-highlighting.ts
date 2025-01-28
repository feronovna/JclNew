import { AstNode } from 'langium';
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from 'langium/lsp';
import { isInlineDDParameters, isSetParameter, isDDParameters, isDDStatement, isJobStatement, isExecStatement, isContinueDDStatement } from '../language/generated/ast.js';
import { SemanticTokenTypes } from 'vscode-languageserver';

export class JclSemanticTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void | undefined | 'prune' {
        if (isJobStatement(node) || isExecStatement(node) ||isDDStatement(node) ) {
            acceptor({
                node,
                property: 'name',
                type: SemanticTokenTypes.class
            });
            acceptor({
                node,
                property: 'oper',
                type: SemanticTokenTypes.macro
            });        
        } else if (isSetParameter(node) || isDDParameters(node)) {
            acceptor({
                node,
                property: 'name',
                type: SemanticTokenTypes.interface
            });
        } else if (isInlineDDParameters(node)) {
            acceptor({
                node,
                property: 'value',
                type: SemanticTokenTypes.comment
            });
        } else if (isContinueDDStatement(node)) {
            acceptor({
                node,
                property: 'oper',
                type: SemanticTokenTypes.macro
            });
        // } else if (isEndStatement(node)) {
        //     const container = node.$container;
        //     acceptor({
        //         node,
        //         property: 'label',
        //         type: isProcedureStatement(container) ? SemanticTokenTypes.function : SemanticTokenTypes.variable
        //     })
        // } else if (isLabelReference(node)) {
        //     acceptor({
        //         node,
        //         property: 'label',
        //         type: SemanticTokenTypes.variable
        //     })
        // } else if (isProcedureCall(node)) {
        //     acceptor({
        //         node,
        //         property: 'procedure',
        //         type: SemanticTokenTypes.function
        //     });
        // } else if (isLabelPrefix(node)) {
        //     const container = node.$container;
        //     acceptor({
        //         node: node,
        //         property: 'name',
        //         type: isProcedureStatement(container) ? SemanticTokenTypes.function : SemanticTokenTypes.variable
        //     });
        // } else if (isNumberLiteral(node)) {
        //     acceptor({
        //         node,
        //         property: 'value',
        //         type: SemanticTokenTypes.number
        //     });
        // } else if (isStringLiteral(node)) {
        //     acceptor({
        //         node,
        //         property: 'value',
        //         type: SemanticTokenTypes.string
        //     });
        // } else if (isLiteral(node)) {
        //     acceptor({
        //         node,
        //         property: 'multiplier',
        //         type: SemanticTokenTypes.number
        //     });
        }
    }

}
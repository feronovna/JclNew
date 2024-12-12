import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { JobControlLanguageAstType, JobStatement, ExecStatement, DDStatement, DDParameters, ExecParameters, JobParameters } from './generated/ast.js';
import type { JobControlLanguageServices } from './job-control-language-module.js';


/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: JobControlLanguageServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.JobControlLanguageValidator;
    const checks: ValidationChecks<JobControlLanguageAstType> = {
        JobStatement: validator.checkCardNameLength,
        ExecStatement: validator.checkCardNameLength,
        DDStatement: validator.checkCardNameLength,
        JobParameters: validator.checkDuplicateParameterNames,
        DDParameters : validator.checkDuplicateParameterNames,
        ExecParameters: validator.checkDuplicateParameterNames
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class JobControlLanguageValidator {

    // checkStartLine(card:JobStatement|ExecStatement|DDStatement, acceptor: ValidationAcceptor) :void{
    //     if (card){
    //         if (card.$document?.textDocument.positionAt(0).character !== 1){

    //         }
    //     }
    // }
    checkCardNameLength(card: JobStatement|ExecStatement|DDStatement, accept: ValidationAcceptor): void {
        console.log(card.$document?.textDocument.positionAt(0).character)
        if (card) {
            if (card.name.length > 8) {
                accept('warning', `Jcl card name should be max 8 char ${card.$document?.textDocument.positionAt(0).character}`, { node: card, property: 'name' });
            }
        }
    }

    checkDuplicateParameterNames(card: DDParameters|ExecParameters|JobParameters, accept: ValidationAcceptor): void{
        if (card){
            const reported = new Set();
            card.keyword.forEach(d =>{
                if (reported.has(d.name)){
                    accept('warning','Duplicated parameters',{ node : d, property : 'name'})
                }
                reported.add(d.name)
            })
        }
    }

}

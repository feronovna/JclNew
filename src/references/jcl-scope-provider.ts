import { DefaultScopeProvider, ReferenceInfo, Scope, AstUtils,AstNodeDescription, Stream, stream, EMPTY_SCOPE} from "langium";
import { isDsname,  isJclProgram, JclProgram,SetStatement} from "../language/generated/ast.js";
export class JclScopeProvider extends DefaultScopeProvider{
    override getScope(context: ReferenceInfo): Scope {
        const scopes: Array<Stream<AstNodeDescription>> = [];
        const referenceType = this.reflection.getReferenceType(context);
        const precomputed = AstUtils.getDocument(context.container).precomputedScopes;
        let model: JclProgram = AstUtils.getContainerOfType(context.container, isJclProgram)!
        if (precomputed) {
            if (context.property==='set' && isDsname(context.container)){
                let setStatement : SetStatement[]= model?.set;              
                for (let set of setStatement){
                    let allDescriptions = precomputed.get(set.param);
                    let offset = allDescriptions[0].selectionSegment?.offset;
                    let setOffset=context.container.$cstNode?.offset;
                    if (setOffset && offset){
                        if (setOffset > offset){
                            scopes.push(stream(allDescriptions))  
                        }
                    }            
                }
            // }else if (context.property==='ref' && isExprKeyword(context.container)) {
            //     let jobSteps : JobStep[] = model?.step;         
            //         for (let set of setStatement){
            //             let allDescriptions = precomputed.get(set.param);
            //             let offset = allDescriptions[0].selectionSegment?.offset;
            //             let setOffset=context.container.$cstNode?.offset;
            //             if (setOffset && offset){
            //                 if (setOffset > offset){
            //                     scopes.push(stream(allDescriptions))  
            //                 }
            //             }            
            //         }
            //     // const descriptions = setParameter.map(p => this.descriptions.createDescription(p, p.name));

            //     // return new MapScope(descriptions);
            
                let result: Scope = this.getGlobalScope(referenceType, context);
                for (let i = scopes.length - 1; i >= 0; i--) {
                    result = this.createScope(scopes[i], result);
                }
                return result;
        } else {
            return EMPTY_SCOPE
        }
    
    } else {
            return super.getScope(context)
        }
    }
}
const vscode = require('vscode')


// var Environment = {
//     language : function() {
//         return vscode.window.activeTextEditor.document.languageId},
//     activeWorkspace : vscode.workspace.name ? true : false,
//     vcs : {
//         extensionApi : vscode.extensions.getExtension('vscode.git').exports,
//         gitExtension : vscode.extensions.getExtension('vscode.git').exports.getApi(1),
//         currentRepo : vscode.extensions.getExtension('vscode.git').exports.getApi(1).repositories[0],
//         branches : this.Environment.language
//     },
//     currentTextEditor : vscode.window.activeTextEditor
// }

var Environment = new function() {
    let language = vscode.window.activeTextEditor.document.languageId
    let activeWorkspace = vscode.workspace.name ? true : false
    let editor = vscode.window.activeTextEditor
    // let cursor = v

    let vcs = function() {
        let extensionApi = vscode.extensions.getExtension('vscode.git').exports.getApi(1)
        let repos = extensionApi.repositories
        let currentRepo = extensionApi.repositories[0]
        let branches = extensionApi.branches
        let remotes = currentRepo.remotes
    };

}

// class Environment {
//     static get language() {
//         return vscode.window.activeTextEditor.document.languageId
//     }
//     static get activeWorkspace() {
//         return vscode.workspace.name ? true : false
//     }
//     // static get allSymbols() {
//     //     var a = new vscode.DocumentSymbol.provider
//     //     this.activeWorkspace ? 
//     // }
    
//     this.vcs = function() {
//         let extensionApi = vscode.extensions.getExtension('vscode.git').exports.getApi(1)
//         let currentRepo = extensionApi.repositories[0]
//         let branches = extensionApi.branches
//     };


// }

module.exports = {
    Environment
}
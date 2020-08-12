/*
    VCS Command examples:
    - "Commit and push my code"
    - "Rebase my project"
    - "Switch to 'xyz' branch"
*/

const nlp = require('node-nlp')
const vscode = require('vscode')

var TextCorpora = {
    vcs: ["pull", "push", "commit", "project", "git", "branch", "rebase", "fetch", "merge", "revert"],
    stopWords: ["maybe", "let's", "just", "try", "okay", "ok", "you", "please"]
    // allSymbols: 

}

module.exports = {
    TextCorpora
}
const axios = require('axios').default
const vscode = require('vscode')
const env = require('./environment').Environment
const natural = require('natural')
const textCorpora = require('./TextCorpora').TextCorpora

const soBaseUrl = "https://api.stackexchange.com/2.2/"
let params = "search/advanced" + "?" + "site=stackoverflow" + "&sort=relevance" + "&οrder=desc" + "&answers=1" + "&accepted=true" + "&filter=!8IfuBy8t3Q.qCO)NDzOme" 

const NLPUtility = {
    stackOverflowQuery: async function (phrase) {
        var query = encodeURI(soBaseUrl + params + `&tags=${env.language}` + `&q=${phrase}`)
        console.log(query)
        let code = ""
        axios.get(query)
            .then((response) => {
                console.log("Successful query")
                
                var body = response.data["items"][0]["answers"][0]["body"] 
                console.log("raw body: " + body)
                
                while(body.includes("<code>")) {
                    code += body.slice(body.indexOf("<code>") + 6, body.indexOf("</code>")) + "\n"
                    body = body.slice(body.indexOf("</code>") + 7)
                }
                console.log(code)
            })
            .catch((error) => {
                console.error("big big sad: " + error)
            })
            return code
    },

    loadModel: function(input) {
        // let checkVCS = function(input, classifier) {
        //     let res = classifier.getClassifications(input)
        //     console.log(res)
        //     let sum = 0;
        //     for(var i in res) {
        //         sum += i['value']
        //     } 
        // }
        // let classifierThing;
        // natural.BayesClassifier.load(__dirname + '/classifierModel.json', null, function(err, classifier) {
        //     if(err) {
        //         console.log(err)
        //         debugger;
        //         return null
        //     }
        //     else {
        //         return function(err, classifier) {
        //             classifierThing = classifier
        //             checkVCS(input, classifier)
        //         }()
        //     }
        // })
        // return classifierThing
        return natural.BayesClassifier.restore(require('./classifierModel.json'))
    },

    

    vcsTrain: function() {
        let classifier = new natural.BayesClassifier()

        classifier.addDocument('Commit my code','vcs.commit')
        classifier.addDocument('Push to remote', 'vcs.push')
        classifier.addDocument('Push my code', 'vcs.push')
        classifier.addDocument('Switch to main branch', 'vcs.switch-branch')
        classifier.addDocument('Add all files', 'vcs.addAll')
        classifier.addDocument('Init repo', 'vcs.init')
        classifier.addDocument('Create a repository', 'vcs.init')
        classifier.addDocument('Make a new repository', 'vcs.init')
        classifier.addDocument('Init repository', 'vcs.init')

        classifier.train()
        
        classifier.save(__dirname + '/classifierModel.json', (error, classifier) => {
            if(error) {
                console.log(error)
                console.log(__dirname)
                debugger;
            }
            else 
                console.log('Classifier saved')
        })
        return classifier
    },
    vcsOps : function(classification) {
        switch(classification) {
            case 'vcs.commit':
                env.vcs.currentRepo.commit(() => {
                    return 'automated commit!!'
                }, null)
                break;
            case 'vcs.push':
                if(env.vcs.remote) {
                    env.vcs.push(env.vcs.head, env.vcs.ForcePushMode.Force)
                }
                else {
                    console.log('No remotes!!')
                }
                break;
            case 'vcs.switch-branch':
                if(env.vcs.branches > 1) {
                    
                }
                break;
            
            case 'vcs.addAll':

                break;

            case 'vcs.init':
                if(!env.vcs.repos) {
                    env.vcs.extensionApi.Git().init('name')
                }
                else {
                    console.log('repos already exist, cant make a new one')
                }
                break;

            default:
                console.log('defau')

                break;
        }
    }

}

module.exports = {
    NLPUtility,
    axios
    // NLPUtil
}

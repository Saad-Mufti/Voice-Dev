const axios = require('axios').default
const env = require('./environment').Environment
// const {nlp} = require('node-nlp')
const textCorpora = require('./TextCorpora').TextCorpora

const { containerBootstrap } = require('@nlpjs/core');
const { Nlp } = require('@nlpjs/nlp');
const { LangEn } = require('@nlpjs/lang-en-min');


const soBaseUrl = "https://api.stackexchange.com/2.2/"
let params = "search/advanced" + "?" + "site=stackoverflow" + "&sort=relevance" + "&οrder=desc" + "&answers=1" + "&accepted=true" + "&filter=!8IfuBy8t3Q.qCO)NDzOme" 

class NLPUtility {
    async stackOverflowQuery(phrase) {
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
    }

    loadModel(input) {
        
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
        return 
    }

    

    async vcsTrain() {

        const container = await containerBootstrap();
        container.use(Nlp);
        container.use(LangEn);
        const manager = container.get('nlp');
        manager.settings.autoSave = false;
        manager.settings.modelFileName = 'classifierModel'
        manager.addLanguage('en');

        manager.addDocument('en', 'Commit my code','vcs.commit')
        manager.addDocument('en', 'Push to remote', 'vcs.push')
        manager.addDocument('en', 'Push my code', 'vcs.push')
        manager.addDocument('en', 'Switch to main branch', 'vcs.switch-branch')
        manager.addDocument('en', 'Add all files', 'vcs.addAll')
        manager.addDocument('en', 'Init repo', 'vcs.init')
        manager.addDocument('en', 'Create a repository', 'vcs.init')
        manager.addDocument('en', 'Make a new repository', 'vcs.init')
        manager.addDocument('en', 'Init repository', 'vcs.init')

        await manager.train()
        // manager.save()
        let ex = await manager.process('en', 'commit my code')
        // debugger
        console.log('commit my code: ' + ex.classifications[0].intent)
        return manager
        
    }

    get classifier() {
        return this.vcsTrain().then(async (res)=> {
            return res
        })
    }

    vcsOps(phrase, classification) {
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


            case 'None':
                return this.stackOverflowQuery(phrase)
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

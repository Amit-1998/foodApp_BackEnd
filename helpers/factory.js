// design Pattern hai -> code ko likhne ka ek pattern
// this is called low-level design

function createElement(elementModel){ // high-level function which uses or takes model
    // async function vaala tabhi chalega jab ise call lagegi yha se .post(bodyChecker, isAuthorized(["admin"]), createUser) 
    return async function(req, res){
        try{
           let element = await elementModel.create(req.body);
           console.log(element);
           res.status(200).json({
               element: element
           });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
}

function getElement(elementModel){
    return async function(req, res){
        let { id } = req.params;
        try{
            let element = await elementModel.findById(id);
            // console.log(user);
            res.status(200).json({
                "message": element
            })
        }
        catch(err){
            res.status(502).json({
                message: err.message
            })
        }
    }
}

function getElements(elementModel){
    return async function(req, res) {
        try {
            // query.params vaali chis hame req.query se mil jaati hai
            let requestPromise;
            // query
            if(req.query.myQuery){ // agar req.query mein myQuery exist karti hai to uske hisaab se element mangaalo but that would nbe the promise
                // jaan bhujh kar Promise mein mangaaya for some reason hamne chaining kar di wait nhi kar rhe saare kaamsortthan select than paginate sab krane ke baad hi await kra hai
                requestPromise = elementModel.find(req.query.myQuery);
            }
            else{
                requestPromise = elementModel.find(); // if myQuery not exist than normal find kardo
            }
            //sort -> iske hisaab se sort kardo
            if(req.query.sort){
                requestPromise = requestPromise.sort(req.query.sort); // jo ismein req.query.sort mein aaya hai usi basis par sort karenge

            }
            // select(menas filter) -> is something select only kuch part
            if(req.query.select){
                // iske ander keys alag-alag hokar aa jayengi
                // jaise kisine query mein name and price ke basis par kuch maanga to ham pehle name and price par chise alag alag karenge than fir chise add karunga
                let params = req.query.select.split("%").join(" ");
                requestPromise = requestPromise.select(params);
            }

            // paginate
            let page = Number(req.query.page) || 1; // atleast 1 page to bydefault ham rakhenge hi agar user ne nhi bhi pass kara to req.query.page mein to
            let limit = Number(req.query.limit) || 4; // by default ek page par 4 items ki limit rakh di agar user nhi bhi pass karega req.query.limit mein tab bhi
            let toSkip = (page-1)*limit;
            requestPromise = requestPromise.skip(toSkip).limit(limit);
            
            // pehle chaining chal rhi thi
            let elements = await requestPromise; // hamne last mein jakr await lgaya
            // if(req.query.page && req.query.limit){
            //     // bande ne do chise di hai ek to page no and ek page par kitni chise aa sakti hai
            // }


            res.status(200).json({
                "message": elements
            })

        } catch (err) {
            res.status(502).json({
                message: err.message
            })
        }
    }
}

function updateElement(elementModel){
    return async function(req, res){
        let { id } = req.params;
        try{
            // ham password & confirm Password nhi  update  krvana chahenge through updateUser
            // agar galti se bande ne req.body mein password daal dia hai to
            if (req.body.password || req.body.confirmPassword) { // ye vaala code sirf userModel ke liye hi chalega ,planModel mein is if mein nhi ghusega
                return res.json({
                    message: "use forget password instead, to update p & cP"
                })
            }
           let element = await elementModel.findById(id);
              console.log("element",element);
           console.log(req.body);
           if(element){
               for(let key in req.body){
                   element[key] = req.body[key];
               }
               console.log("element",element);
               // save -> confirm, password
               // [options.validateBeforeSave] «Boolean» set to false to save without validating.
               // validateBeforeSave: false krane se jo schema mein hamne required: true kra hai and jo email ko validaate function diye ye sab chise ko run or check nhi karega unhe rokega validate karne se
               // schema mein jo pre('save') likha use bhi nhi chalne dega
               await element.save({
                   validateBeforeSave: false
               });
               res.status(200).json({
                   element: element
               });
            }
           else{
              res.status(404).json({
                  message: "user not found"
              })  
           }
        } 
        catch(err){
             console.log(err);
             res.status(500).json({
                 message: "Server error"
             });
        }
    }
}

function deleteElement(elementModel){
    return async function(req, res){
        let { id } = req.params;
        try{
           let element = await elementModel.findByIdAndDelete(id);
           res.status(200).json({
               element: element
           });
        }
        catch(err){
            console.log(err);
            req.status(500).json({
                message: "Server error"
            });
        }
   }
}

module.exports.createElement = createElement;
module.exports.getElement = getElement;
module.exports.getElements = getElements;
module.exports.updateElement = updateElement;
module.exports.deleteElement = deleteElement;
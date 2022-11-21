const sauce = require('../models/sauce');
const fs = require('fs');
/*const { find } = require('../models/sauce');*/



/*-------------------------Affichage de la liste de sauce-----------------*/

exports.getAll= (req, res, next) => {
    sauce.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
};


/*------------------------ Importer une sauce--------------------------*/
exports.upload = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;
    
    const sauw = new sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[],
       

    });
  
    sauw.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

/*-----------------------Afficher une sauce----------------*/

exports.getOne=(req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  }



/*------------------Supprime une sauce---------------*/

exports.deleteOne=(req, res, next) => {
    sauce.findOne({ _id: req.params.id})
    .then(thing => {
        if (thing.userId != req.auth.userId) {
            res.status(403).json({message: 'Not authorized'});
        } else {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
   };

/*-----------Modification Sauce-------------*/

exports.modifySauce = (req, res, next) => {
    /*----Si dans la requete il y a un file a parser-------*/
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } 
    
    : { ...req.body }; /*--- Ou Recupération corps de la request----*/


    delete sauceObject._userId;


    sauce.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(403).json({ message : 'Not authorized'});
            } else {
                sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(401).json({ error });
        }); 
};





/*--------------------Like----------------------*/


exports.likeOrNot=(req,res,next)=> {

   

    let like= req.body.like
    let userID=req.body.userId
   
    


    
    
        if (like == 1) {

            
            sauce.updateOne({_id: req.params.id},{$push:{usersLiked:userID},$inc: { likes: +1}})
            
                .then(() => { res.status(200).json({message: 'I love it!'})})
                .catch(error => res.status(401).json({ error }));


        } else if (like == -1){

           

            sauce.updateOne({_id: req.params.id},{$push:{usersDisliked:userID},$inc: { dislikes: +1}})
           
                .then(() => { res.status(200).json({message: 'Taste Bad'})})
                .catch(error => res.status(401).json({ error }));


        }else{

            sauce.findOne({_id: req.params.id})

            .then((Sauce) => { 
                if (Sauce.usersLiked.includes(userID)){
                    sauce.updateOne({_id: req.params.id},{$pull:{usersLiked:{$in:[`${userID}`]}},$inc: { likes: -1}})
                    .then(() => { res.status(200).json({message: 'i don t love it anymore'})})
                    .catch(error => res.status(401).json({ error }));
                }
                if(Sauce.usersDisliked.includes(userID)){
                    sauce.updateOne({_id: req.params.id},{$pull:{usersDisliked:{$in:[`${userID}`]}},$inc: { dislikes: -1}})
                    
                    .then(() => { res.status(200).json({message: 'i don t hate hate anymore'})})
                    .catch(error => res.status(401).json({ error }));
            }})
            .catch(error => res.status(401).json({ error }));
            };
            
        }


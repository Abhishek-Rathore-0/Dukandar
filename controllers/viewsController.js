exports.home = async(req, res, next) => { 
    res.render("home");
}

exports.shopkeeper = async(req, res, next) => { 
    res.status(200).render("agent");
}

exports.account = async(req, res, next) =>{
    res.status(200).render('account');
}

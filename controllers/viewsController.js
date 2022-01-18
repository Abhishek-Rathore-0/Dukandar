exports.home = async(req, res, next) => { 
    res.render("home");
}

exports.account = async(req, res, next) =>{
    res.status(200).render('account');
}

exports.shopkeeper = async(req, res, next) => { 
    res.status(200).render("agent");
}

exports.signup = async(req, res, next) => { 
    res.status(200).render("signup");
}

exports.agentaccount = async(req, res, next) =>{
    res.status(200).render('aacount');
}

exports.products = async(req, res, next) =>{
    res.status(200).render('products');
}
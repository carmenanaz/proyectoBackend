class ViewsController{
    constructor(){}
    
    home = (req,res) => {
        res.render('index');
    }

    login = (req, res)=>{
        res.render('login', {})
    }

    register = (req, res)=>{
        res.render('register', {})
    }
}

export default ViewsController
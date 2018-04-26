

class ControlUsuarios
{
    constructor(req, res, next)
    {
        this.req = req;
        this.res= res;
        this.next = next;
    }

    autenticar(){
        this.res.redirect('/');
    }
}

module.exports = ControlUsuarios;
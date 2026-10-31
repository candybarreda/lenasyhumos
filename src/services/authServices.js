cons AUTH_NOT_CONFIGURED =
"La autenticacion todavia no esta configurada. Intentalo mas adelante.";

function unavailable()
{
    trhow new Error(AUTH_NOT_CONFIGURED);
    
}

export const authService = {
    async login(email, password) {
        unavailable();
    },

    async register(name, email, password){
        unavailable();
    }

    async logout(){
        unavailable();
    }

    async resetPassword(email){
        unavailable();
    }

    async getCurrentUser(){
        return null
    };
}
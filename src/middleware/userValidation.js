const addNewUser = (req, res, next) => {
    const { email, password, phone} = req.body;
    const validateQuery = Object.keys(req.body).filter(
        (key) => {
return key === "email" || key === "password" || key === "phone";
}
    );

    if(validateQuery.length < 3){
        return res.status(400).json({
            error: "New product input must contain email, password, phone!",
            added_input: validateQuery
        });
    }
    next();
};

const updateUser = (req, res, next) => {
    let {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex_id, picture} = req.body;

    if(first_name){
        if(first_name.length > 20){
            return res.status(400).json({
                error: "First name cannot be longer than 20 characters!"
            });
        }
    }
    if(last_name){
        if(last_name.length > 20){
            return res.status(400).json({
                error: "Last name cannot be longer than 20 characters!"
            });
        }
    }
    if(display_name){
        if(display_name.length > 20){
            return res.status(400).json({
                error: "Display name cannot be longer than 20 characters!"
            });
        }
    }
    if(address){
        if(address){
            if(address.length >= 120){
                return res.status(400).json({
                    error: "Address cannot be longer than 120 characters!"
                });
            }
        }
    }
    if(sex_id){
        if(sex_id !== "1" && sex_id !== "2"){
            return res.status(400).json({
                error: "Invalid input sex_id!"
            });
        }
    }
    next();
};

module.exports = {
    addNewUser, 
    updateUser
};

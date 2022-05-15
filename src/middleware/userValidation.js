const addNewUser = (req, res, next) => {
    const {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture} = req.body
    const validateQuery = Object.keys(req.body).filter(
        (key) =>
            key === "first_name" || key === "last_name" || key === "display_name" ||
            key === "email" || key === "password" || key === "phone" ||
            key === "date_of_birth" || key === "address" || key === "sex"
    );

    if(validateQuery.length < 9){
        return res.status(400).json({
            error: "New product input must contain first_name, last_name, display_name, email, password, phone, date_of_birth, address, and sex!",
            added_input: validateQuery,
        });
    }
    if(first_name.length >= 20){
        return res.status(400).json({
            error: "First name cannot be longer than 20 characters!"
        })
    }
    if(last_name.length >= 20){
        return res.status(400).json({
            error: "Last name cannot be longer than 20 characters!"
        })
    }
    if(display_name.length >= 20){
        return res.status(400).json({
            error: "Display name cannot be longer than 20 characters!"
        })
    }
    if(sex !== 1 && sex !== 2){
        return res.status(400).json({
            error: "Invalid input sex!"
        });
    }
    if(address){
        if(address.length >= 120){
            return res.status(400).json({
                error: "Address cannot be longer than 120 characters!"
            })
        }
    }
    next();
};

const updateUser = (req, res, next) => {
    let {first_name, last_name, display_name, email, password, phone, date_of_birth, address, sex, picture} = req.body

    if(first_name){
        if(first_name.length > 20){
            return res.status(400).json({
                error: "First name cannot be longer than 20 characters!"
            })
        }
    }
    if(last_name){
        if(last_name.length > 20){
            return res.status(400).json({
                error: "Last name cannot be longer than 20 characters!"
            })
        }
    }
    if(display_name){
        if(display_name.length > 20){
            return res.status(400).json({
                error: "Display name cannot be longer than 20 characters!"
            })
        }
    }
    if(address){
        if(address){
            if(address.length >= 120){
                return res.status(400).json({
                    error: "Address cannot be longer than 120 characters!"
                })
            }
        }
    }
    if(sex){
        if(sex !== "1" && sex !== "2"){
            return res.status(400).json({
                error: "Invalid input sex!"
            });
        }
    }
    next();
};

module.exports = {
    addNewUser, 
    updateUser
};
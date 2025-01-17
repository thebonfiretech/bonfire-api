import { ManageRequestBody } from "@middlewares/manageRequest";
import formControlModel from "@database/model/formControl";
import stringService from "@utils/services/stringServices";
import { hasUser } from "@database/functions/user";


const formsResource = {
    createFormControl: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            if (user.role != "admin") return manageError({ code: "admin_access_denied" });

            let { name, description, images, authenticationRequired, singleShipping, shuffle, collectEmail, questions } = data;
            if (!name || !questions) return manageError({ code: "invalid_data" });

            name = stringService.removeSpacesAndLowerCase(name);

            const hasFormControl = await formControlModel.findOne({ name });
            if (hasFormControl) return manageError({ code: "form_not_found" });

            const newForm = new formControlModel({
                authenticationRequired, 
                user: {
                    name: user.name,
                    id: user._id
                },
                createAt: Date.now(),
                singleShipping, 
                collectEmail, 
                description, 
                questions,
                shuffle, 
                images, 
                name,
            }); 

            return await newForm.save();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default formsResource;
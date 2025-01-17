import { ManageRequestBody } from "@middlewares/manageRequest";
import formControlModel from "@database/model/formControl";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { hasUser } from "@database/functions/user";


const formsResource = {
    createFormControl: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            let { name, description, images, authenticationRequired, singleShipping, shuffle, collectEmail, questions } = data;
            if (!name || !questions) return manageError({ code: "invalid_data" });

            name = stringService.removeSpacesAndLowerCase(name);

            const hasFormControl = await formControlModel.findOne({ name });
            if (hasFormControl) return manageError({ code: "form_already_exists" });

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
    updateFormControl: async ({ data, manageError, params }: ManageRequestBody) => {
        try {
            const { formControlID } = params;
            if (!formControlID) return manageError({ code: "invalid_params" });

            const formControl = await formControlModel.findById(formControlID);
            if (!formControl) return manageError({ code: "form_not_found" });

            let filteredFormControl = objectService.filterObject(data, ["user", "createAt", "_id"]);

            if (filteredFormControl.name) filteredFormControl.name = stringService.removeSpacesAndLowerCase(filteredFormControl.name);
           
            return await formControlModel.findByIdAndUpdate(formControlID, { $set:{ ...filteredFormControl, lastUpdate: Date.now() } }, { new: true });

        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getFormControl: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { formControlID } = params;
            if (!formControlID) return manageError({ code: "invalid_params" });

            const formControl = await formControlModel.findById(formControlID);
            if (!formControl) return manageError({ code: "form_not_found" });

            return formControl;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getFormControlWithName: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { name } = params;
            if (!name) return manageError({ code: "invalid_params" });

            const formControl = await formControlModel.findOne({name});
            if (!formControl) return manageError({ code: "form_not_found" });

            return formControl;
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getFormsControl: async ({ manageError }: ManageRequestBody) => {
        try {
            return await formControlModel.find();
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default formsResource;
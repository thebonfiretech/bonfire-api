import { ManageRequestBody } from "@middlewares/manageRequest";
import formControlModel from "@database/model/formControl";
import stringService from "@utils/services/stringServices";
import objectService from "@utils/services/objectServices";
import { hasUser } from "@database/functions/user";
import formModel from "@database/model/form";


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
    deleteFormControl: async ({  manageError, params }: ManageRequestBody) => {
        try {
            const { formControlID } = params;
            if (!formControlID) return manageError({ code: "invalid_params" });

            const formControl = await formControlModel.findById(formControlID);
            if (!formControl) return manageError({ code: "form_not_found" });

            await formControlModel.findByIdAndDelete(formControlID);
            
            return {
                delete: true
            };
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
    getCompletedForms: async ({ manageError, params }: ManageRequestBody) => {
        try {
            const { formControlID } = params;
            if (!formControlID) return manageError({ code: "invalid_params" });

            const formControl = await formControlModel.findById(formControlID);
            if (!formControl) return manageError({ code: "form_not_found" });

            return await formModel.find({ formControlID: formControlID });
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    canSendForm: async ({ manageError, params, ids }: ManageRequestBody) => {
        try {
            const { userID } =  ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const { name } = params;
            if (!name ) return manageError({ code: "invalid_params" });

            const formControl = await formControlModel.findOne({name});
            if (!formControl) return manageError({ code: "form_not_found" });

            const hasFillForm = await formModel.exists({ formControlID: formControl._id, "user.id": userID });
            
            return {
                authorized: !hasFillForm
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    sendForm: async ({ manageError, params, data, defaultExpress }: ManageRequestBody) => {
        try {
            let { name } = params;
            if (!name ) return manageError({ code: "invalid_params" });

            name = stringService.removeSpacesAndLowerCase(name);

            const formControl = await formControlModel.findOne({name});
            if (!formControl) return manageError({ code: "form_not_found" });

            const { answers, user } = data;

            if (formControl.authenticationRequired){
                var token = defaultExpress.req.header('authorization');
                if (!token || !user.id) return manageError({ code: "unauthorized_form_submission" });
            };

            if (formControl.collectEmail && !user.email) return manageError({ code: "unauthorized_form_submission" });

            if (formControl.singleShipping){
                const hasFillForm = await formModel.exists({ formControlID: formControl._id, "user.id": user.id });
                if (hasFillForm) return manageError({ code: "unauthorized_form_submission" });
            };
            
            const newForm = new formModel({
                formControlID: formControl._id,
                answers,
                user
            });

            return await newForm.save();

        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
};

export default formsResource;
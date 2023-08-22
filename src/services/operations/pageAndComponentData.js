import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading . . . ");

    let result = [] ;
    try {
        const response = await apiConnector("POST" , catalogData.CATALOGPAGEDATA_API ,
        {categoryId : categoryId , });

        // console.log("Data Courses ? " , response.data.data)

        if(!response?.data?.success) 
            throw new Error("Could Not Fetch Category Page Data!");
        

        result = response?.data;

    } catch(error) {
        console.log("CATALOG PAGE DATA API ERROR ... " , error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}


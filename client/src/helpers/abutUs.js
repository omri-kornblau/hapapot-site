import Axios from "axios";


const AbutUsHelper = {};

AbutUsHelper.getPage = async () => {
    return await Axios.get("/api/aboutus");
}



export default AbutUsHelper;
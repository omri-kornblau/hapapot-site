import Axios from "axios";

const AboutUsHelper = {};

AboutUsHelper.getPage = async () => {
    return await Axios.get("/api/aboutus");
}

export default AboutUsHelper;
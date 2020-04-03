import {
    get
} from "./wrappedRequests";

const AboutUsHelper = {};

AboutUsHelper.getPage = async () => {
    return get("/api/aboutus");
}

export default AboutUsHelper;
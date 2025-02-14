
import dbConnect from "@/lib/dbConnect";
import PromptGalleryModel from "@/models/PromptGallery.model";


export async function GET(request:Request, response:Response){

    await dbConnect();


    try {
        const prompts = await PromptGalleryModel.find();
        console.log(prompts)
    } catch (error) {
        console.error("route.ts", " :: GET() :: Error ❌ : ", error);
    }


}
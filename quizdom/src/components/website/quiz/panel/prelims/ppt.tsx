import PptxViewer from "./pptxviewer";



export default function PPTViewer({ category }: { category: string }) {

    // HADNLING CATEOGRY
    const pptURl = `https://idoxdew.sufydely.com/prelims/${category}/prelims.pptx`;

    return (
     <div>
      <PptxViewer src={pptURl}/>
    </div>
    );
}
import React from "react";
import { TextInput, Select, FileInput, Button } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h3 className="text-3xl font-semibold text-center my-7">Create Post</h3>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            id="title"
            className="flex-1"
            required
            placeholder="Title"
          />
          <Select
            type="select"
            id="category"
            outline
            required
            placeholder="Title"
          >
            <option value="uncategorized">Select your category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React JS</option>
            <option value="nextjs">Next JS</option>
          </Select>
        </div>
        <div className="border-4 border-dotted border-teal-500 p-3 flex justify-between">
          <FileInput />
          <Button gradientDuoTone="purpleToBlue" outline>
            Upload Image
          </Button>
        </div>
        <ReactQuill className="h-72 mb-12" theme="snow" required />
        <Button gradientDuoTone={"purpleToPink"}>Publish</Button>
      </form>
    </div>
  );
}

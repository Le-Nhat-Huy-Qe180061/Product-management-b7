tinymce.init({
    selector: "textarea.textarea-mce", // này là chọ ô #id or class textarea.textarea-mce là lấy tất cả các class có textarea-mce 
    plugins: 'advlist link image lists',


    //https://www.tiny.cloud/docs/tinymce/latest/file-image-upload/
    file_picker_callback: (cb, value, meta) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
    
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            /*
              Note: Now we need to register the blob in TinyMCEs image blob
              registry. In the next release this part hopefully won't be
              necessary, as we are looking to handle it internally.
            */
            const id = 'blobid' + (new Date()).getTime();
            const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
            const base64 = reader.result.split(',')[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
    
            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          });
          reader.readAsDataURL(file);
        });
    
        input.click();
      },
});
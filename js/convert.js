//
    // Disable workers to avoid yet another cross-origin issue (workers need the URL of
    // the script to be loaded, and dynamically loading a cross-origin script does
    // not work)
    //
    PDFJS.disableWorker = true;

    //
    // Asynchronous download PDF as an ArrayBuffer
    //
    var pdf = document.getElementById('pdf');
    pdf.onchange = function(ev) {

      if (file = document.getElementById('pdf').files[0]) {
        fileReader = new FileReader();
        fileReader.onload = function(ev) {
          console.log("The ev value: ",ev);
          PDFJS.getDocument(fileReader.result).then(function getPdfHelloWorld(pdf) {
            //
            // Fetch the first page
            //
            console.log("The PDF output: ",pdf)
            pdf.getPage(1).then(function getPageHelloWorld(page) {
              var scale = 1.5;
              var viewport = page.getViewport(scale);

              console.log("The extracted page: ",page)
              //
              // Prepare canvas using PDF page dimensions
              //
              var canvas = document.getElementById('the-canvas');
              var context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              //
              // Render PDF page into canvas context
              //
              var task = page.render({ canvasContext: context, viewport: viewport })
              task.promise.then(function(){
                console.log("The choosen element: ",canvas.toDataURL('png'));

                // Decode QR-code value from base64 of selected file with QR-code picture

                function decodeImageFromBase64(data, callback){
                  // set callback
                  qrcode.callback = callback;
                  // Start decoding
                  qrcode.decode(data)
                }

                var imageURI = canvas.toDataURL('png');
                decodeImageFromBase64(imageURI,function(decodedInformation){
                var result = document.getElementById("result");
                result.innerHTML = decodedInformation;
                });

                // End of Decode QR-code value from base64 of selected file with QR-code picture
                
              });
            });
          }, function(error){
            console.log(error);
          });
        };

        fileReader.readAsArrayBuffer(file);
    }
  }  
import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

function MyCustomUploadAdapterPlugin( editor: any ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader );
    };
}


class MyUploadAdapter {
	private loader: any;
    private xhr: XMLHttpRequest | null;

    constructor(loader: any) {
		this.loader = loader;
		this.xhr = null;
	}
	
	upload() {
		return this.loader.file
			.then((file: File) => new Promise((resolve, reject) => {
				this._initRequest();
				this._initListeners(resolve, reject, file);
				this._sendRequest(file);
			}));
	}
	
	abort() {
		if (this.xhr) {
			this.xhr.abort();
		}
	}
	
 _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open( 'POST', 'https://api.cloudinary.com/v1_1/dgn6edv1k/image/upload', true );
        xhr.responseType = 'json';
    }
	
	_initListeners( resolve: any, reject: any, file: any ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr?.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr?.addEventListener( 'abort', () => reject() );
        xhr?.addEventListener( 'load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve( {
                default: response.url
            } );
        } );

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if ( xhr?.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }
	
	_sendRequest( file: File ) {
        // Prepare the form data.
        const data = new FormData();

        data.append( 'upload', file );
		data.append("file", file)
    	data.append("upload_preset", "hqdnnphw");

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.

        // Send the request.
        this.xhr?.send( data );
    }
}



export default function MyEditor({value, onChange}: any) {
	return (

		<CKEditor
			editor={Editor}
			config={{
				htmlSupport: {
					allow: [
						{
							name: /.*/,
							attributes: true,
							classes: true,
							styles: true
						}
					],
				},
				extraPlugins: [ MyCustomUploadAdapterPlugin ],
			}}
			data={value}
			onReady={(editor: any) => {
				// You can store the "editor" and use when it is needed.
				console.log('Editor is ready to use!', editor);
			}}
			onChange={(event: any, editor: any) => {
				const data = editor.getData();
				onChange(data)
			}}

		/>

	)
}
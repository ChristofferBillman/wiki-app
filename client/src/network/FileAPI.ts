import { RefObject } from 'react'
import { BASE_URL } from './common/http'

interface UploadResponse  {
	filename: string
}

async function upload(filePickerRef: RefObject<HTMLInputElement>, onSuccess: (arg0: UploadResponse) => void, onError: (arg0: string) => void) {

	const formData = new FormData()

	if(!filePickerRef.current || !filePickerRef.current.files) {
		throw new Error('Ref to file picker was undefined or no file was selected.')
	}
	
	formData.append('singleFile', filePickerRef.current.files[0])

	fetch(BASE_URL + '/upload', {
		method: 'POST',
		body: formData,
	})
		.then(async res => {
			if(res.status == 401) {
				window.location.href = '/#/login'
				return
			}
			if (res.status >= 400) {
				onError(await res.text())
			}
			if (res.status >= 200 && res.status < 300) {
				onSuccess(await res.json())
			}
		})
		.catch(err => onError(err))
}

const FileAPI = {
	upload
}

export default FileAPI
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
		.then(async res => onSuccess(await res.json()))
		.catch(err => onError(err))
}

const FileAPI = {
	upload
}

export default FileAPI
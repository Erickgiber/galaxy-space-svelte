export const imageCompress = async (
	file: File,
	resolution: number,
	quality: number
): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const img = new Image()
			img.src = reader.result as string
			img.onload = () => {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')

				// Calculamos las nuevas dimensiones de la imagen
				const aspectRatio = img.width / img.height
				const newWidth = resolution
				const newHeight = Math.floor(newWidth / aspectRatio)

				// Establecemos las dimensiones del lienzo
				canvas.width = newWidth
				canvas.height = newHeight

				// Dibujamos la imagen en el lienzo con las nuevas dimensiones
				ctx!.drawImage(img, 0, 0, newWidth, newHeight)

				// Obtenemos la imagen comprimida en formato base64
				const compressedBase64 = canvas.toDataURL('image/jpeg', quality / 100)

				resolve(compressedBase64)
			}
			img.onerror = reject
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

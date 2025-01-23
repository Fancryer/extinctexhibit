import React,{FC,useEffect,useState}                                                    from 'react';
import {FieldError,FieldPathValue,RegisterOptions,SetValueConfig,UseFormRegisterReturn} from "react-hook-form";
import {CreateNewsFormState}                                                            from "../routes/news/create.tsx";

interface FileInputProps
{
	label?:string,
	name:string,
	accept?:string,
	onChange?:(file:File|null)=>void,
	defaultValue?:File,
	register:(
		name:'cover',
		options?:RegisterOptions<CreateNewsFormState,'cover'>
	)=>UseFormRegisterReturn<'cover'>,
	errors:FieldError|undefined,
	setValue:(
		name:'cover',
		value:FieldPathValue<CreateNewsFormState,'cover'>,
		options?:SetValueConfig
	)=>void
}

/* https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript */
const getAverageRgb=
	async(ctx:CanvasRenderingContext2D|null,src:string):Promise<Uint8ClampedArray>=>
		new Promise(resolve=>{
			ctx!.imageSmoothingEnabled=true;

			const img=new Image;
			img.src=src;
			img.crossOrigin="";

			img.onload=()=>{
				ctx!.drawImage(img,0,0,1,1);
				resolve(ctx!.getImageData(0,0,1,1).data.slice(0,3));
			};
		});

const FileInput:FC<FileInputProps>=(
	{
		label,
		name,
		accept='image/jpg,image/jpeg,image/png,image/webp,image/gif',
		onChange,
		register,
		errors,
		setValue,
		defaultValue
	}:FileInputProps
)=>{
	const [canvas,_]=useState<CanvasRenderingContext2D|null>(document.createElement('canvas').getContext('2d'));
	const [selectedFile,setSelectedFile]=useState<File|null>(defaultValue||null);
	const [dragging,setDragging]=useState(false);
	const [filePreview,setFilePreview]=useState<string|null>(null);
	const [averageColor,setAverageColor]=useState<Uint8ClampedArray|null>(null);

	useEffect(()=>{
		const init=async()=>
			setAverageColor(await getAverageRgb(canvas!,filePreview!));

		if(filePreview&&canvas) init().then();
	},[selectedFile])

	const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
		const file=event.target.files?.[0]||null;
		if(file) processFile(file);
	};

	const handleDrop=(event:React.DragEvent<HTMLDivElement>)=>{
		event.preventDefault();
		event.stopPropagation();

		const file=event.dataTransfer.files?.[0];
		if(file) processFile(file);
	};

	const processFile=(file:File)=>{
		if(accept.includes(file.type))
		{
			setSelectedFile(file);
			setFilePreview(URL.createObjectURL(file)); // Генерация превью
			onChange?.(file);
			setValue('cover',file);
		}
		else
		{
			alert('Invalid file type. Please upload an image in jpg, jpeg, png, webp, or gif format.');
		}
	};

	const clearFile=()=>
	{
		setSelectedFile(null);
		setFilePreview(null);
		onChange?.(null);
	};

	return <div className="file-input">
		{
			label
			&&<label className="block text-sm font-medium text-gray-700">
				{label}
            </label>
		}
		<div
			className={
				`mt-1 flex items-center justify-center border-2 ${
					dragging?'border-dashed border-blue-500':'border-gray-300'
				} rounded-lg bg-gray-100 p-4 cursor-pointer`
			}
			style={{
				backgroundImage:   filePreview?`url(${filePreview})`:undefined,
				backgroundSize:    'cover',
				backgroundPosition:'center'
			}}
			onDragOver={e=>{
				e.preventDefault();
				setDragging(true);
			}}
			onDragLeave={()=>setDragging(false)}
			onDrop={handleDrop}
			onClick={()=>document.getElementById(name)?.click()}
		>
			<input
				id={name}
				type="file"
				accept={accept}
				className="hidden"
				{...register('cover',{onChange:handleFileChange})}
			/>
			{selectedFile?(
				<div
					className="text-center bg-white rounded-lg p-3 border-2"
					style={{
						borderColor:averageColor
									?`rgba(${averageColor.join(',')},0.8)`
									:undefined
					}}
				>
					<div className="text-sm font-medium text-gray-700 flex flex-row justify-between items-center">
						{selectedFile.name}
						<span className="w-4"></span>
						<button
							type="button"
							className="bg-red-500 text-white rounded-tr-md p-1 hover:bg-red-600"
							onClick={(e)=>{
								e.stopPropagation(); // Чтобы не вызывался click для загрузки файла
								clearFile();
							}}
						>
							✕
						</button>
					</div>
					<div className="text-xs text-gray-500">
						{(selectedFile.size/1024).toFixed(2)} KB
					</div>
				</div>
			):(
				 <p className="text-sm text-gray-500">
					 Drag & drop an image file here, or click to select a file
				 </p>
			 )}
			{errors&&<span className="text-red-500">{errors.message}</span>}
		</div>
	</div>;
};

export default FileInput;

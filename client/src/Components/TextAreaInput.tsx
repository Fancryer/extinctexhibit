import {ChangeEvent,FC,TextareaHTMLAttributes,useEffect,useRef} from 'react';

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement>
{
	id:string;
	value:string;
	onChange:(e:ChangeEvent<HTMLTextAreaElement>)=>void;
	isFocused?:boolean;
}

const TextareaInput:FC<TextareaInputProps>=(
	{id,value,onChange,className='',isFocused=false,...props}
)=>{
	const textareaRef=useRef<HTMLTextAreaElement>(null);

	useEffect(()=>{
		if(isFocused&&textareaRef.current)
			textareaRef.current.focus();
	},[isFocused]);

	return <textarea
		id={id}
		ref={textareaRef}
		value={value}
		onChange={onChange}
		className={
			`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`
		}
		{...props}
	/>;
};

export default TextareaInput;
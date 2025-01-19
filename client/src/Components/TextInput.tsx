import {
	forwardRef,
	InputHTMLAttributes,RefObject,TextareaHTMLAttributes,
	useEffect,
	useImperativeHandle,
	useRef
} from 'react';

type TextInputProps=
	InputHTMLAttributes<HTMLInputElement>
	&TextareaHTMLAttributes<HTMLTextAreaElement>
	&{
		isFocused?:boolean;
		multiline?:boolean;
	};

export function SingleLineTextArea(props:{
	props:TextInputProps,
	baseClasses:string,
	className:string|undefined,
	localRef:RefObject<HTMLInputElement>
})
{
	return <input
		{...props.props}
		type={props.props.type||"text"}
		className={`${props.baseClasses} ${props.className}`}
		ref={props.localRef}
	/>;
}

export const textInputBaseClasses=()=>
	'rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700' +
	' dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600';

const TextInput=forwardRef(
	(
		{multiline=false,className='',isFocused=false,...props}:TextInputProps,
		ref
	)=>{
		const localRef=useRef<HTMLInputElement|HTMLTextAreaElement>(null);

		useImperativeHandle(ref,()=>({
			focus:()=>localRef.current?.focus()
		}));

		useEffect(()=>{
			if(isFocused) localRef.current?.focus();
		},[isFocused]);

		return multiline
			   ?<textarea
				   {...props}
				   className={`${textInputBaseClasses()} ${className}`}
				   ref={localRef as RefObject<HTMLTextAreaElement>}
			   />
			   :<SingleLineTextArea
				   props={props}
				   baseClasses={`${textInputBaseClasses()}`}
				   className={className}
				   localRef={localRef as RefObject<HTMLInputElement>}
			   />;
	}
);

export default TextInput;

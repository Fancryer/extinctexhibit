import InputLabel    from '@/Components/InputLabel';
import TextInput     from '@/Components/TextInput';
import InputError    from '@/Components/InputError';
import {ChangeEvent} from 'react';

interface ValidatedFormInputProps
{
	className?:string;
	id?:string;
	type?:string;
	name?:string;
	value?:string;
	isFocused?:boolean;
	onChange:(e:ChangeEvent<HTMLInputElement>)=>void;
}

// function ValidatedFormInput(
// 	{
// 		className,
// 		id,
// 		isFocused=true,
// 		name,
// 		type,
// 		value,
// 		onChange=(_)=>{
// 		}
// 	}:ValidatedFormInputProps
// )
// {
// 	return <div>
// 		<InputLabel htmlFor="email" value="Email"/>
// 		<TextInput
// 			id={id}
// 			type={type}
// 			name={name}
// 			value={value}
// 			className="mt-1 block w-full"
// 			autoComplete="username"
// 			isFocused={isFocused}
// 			onChange={e=>setData('email',e.target.value)}
// 		/>
// 		<InputError message={errors.email} className="mt-2"/>
// 	</div>
// }
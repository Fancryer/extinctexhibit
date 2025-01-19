import {LabelHTMLAttributes} from 'react';

export default (
	{value,className='',children,...props}
		:LabelHTMLAttributes<HTMLLabelElement>&{value?:string}
)=><label
	{...props}
	className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
>
	{value||children}
</label>
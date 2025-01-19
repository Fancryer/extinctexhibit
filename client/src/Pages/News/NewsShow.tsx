interface NewsShowProps
{
	title:string;
	content:string;
	cover?:string;
}

export default function Show({title,content,cover}:NewsShowProps){
	return (
		<div>
			<h1>{title}</h1>
			<p>{content}</p>
			{/* Проверяем, есть ли обложка */}
			{cover&&(
				<div>
					<img
						src={cover}
						alt={`Cover for ${title}`}
						style={{maxWidth:'400px',borderRadius:'8px'}}
					/>
				</div>
			)}
		</div>
	);
}
import IconProps from './IconProps'

interface ArrowProps {
	direction?: 'left' | 'right'
}

export function Arrow({ color = 'var(--white)', direction }: (IconProps & ArrowProps)) {

	const rotationStyle = direction == 'left' ? {transform: 'rotate(0deg)'} : {transform: 'rotate(180deg)'}
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={rotationStyle}>
			<g clipPath="url(#clip0_620_130)">
				<path d="M12.8 12.75L11.475 14.075C11.325 14.225 11.25 14.4 11.25 14.6C11.25 14.8 11.325 14.975 11.475 15.125C11.625 15.275 11.8 15.35 12 15.35C12.2 15.35 12.375 15.275 12.525 15.125L15.125 12.525C15.275 12.375 15.35 12.2 15.35 12C15.35 11.8 15.275 11.625 15.125 11.475L12.525 8.875C12.375 8.725 12.2 8.65 12 8.65C11.8 8.65 11.625 8.725 11.475 8.875C11.325 9.025 11.25 9.2 11.25 9.4C11.25 9.6 11.325 9.775 11.475 9.925L12.8 11.25H9C8.78333 11.25 8.60417 11.3208 8.4625 11.4625C8.32083 11.6042 8.25 11.7833 8.25 12C8.25 12.2167 8.32083 12.3958 8.4625 12.5375C8.60417 12.6792 8.78333 12.75 9 12.75H12.8ZM12 22C10.6333 22 9.34167 21.7375 8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3667 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.02917 5.825 4.9375 4.925C5.84583 4.025 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.975 18.1542 19.075 19.0625C18.175 19.9708 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20.5C14.3667 20.5 16.375 19.6708 18.025 18.0125C19.675 16.3542 20.5 14.35 20.5 12C20.5 9.63333 19.675 7.625 18.025 5.975C16.375 4.325 14.3667 3.5 12 3.5C9.65 3.5 7.64583 4.325 5.9875 5.975C4.32917 7.625 3.5 9.63333 3.5 12C3.5 14.35 4.32917 16.3542 5.9875 18.0125C7.64583 19.6708 9.65 20.5 12 20.5Z" fill={color} />
			</g>
			<defs>
				<clipPath id="clip0_620_130">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	)
}
import type { MotionNodeAnimationOptions } from 'framer-motion';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import './index.scss';

interface CardItemProps extends HTMLAttributes<HTMLDivElement> {
	showAnimate: boolean;
	name: string;
	phone: string;
}

export default function CardItem({ showAnimate, name, phone, ...props }: CardItemProps) {
	const animate: MotionNodeAnimationOptions['animate'] = showAnimate
		? {
				scale: [1, 1.1, 1],
				transition: { repeat: Infinity, duration: 0.5 },
			}
		: {};

	return (
		<motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='card-item'>
			<div className='card-item-content' {...props}>
				<motion.div animate={animate} className='name-text'>
					{name}
				</motion.div>
				<motion.div animate={animate} className='number-text'>
					{phone}
				</motion.div>
			</div>
		</motion.div>
	);
}

import type { Data } from '@/global.utils';
import { motion } from 'framer-motion';
import { getWinnersFromSession, saveWinnersToSession } from '@/global.utils';

export default function AdventurePrize({ participants }: { participants: Data[] }) {
	const [isDrawing, setIsDrawing] = useState(false);
	const [winners, setWinners] = useState<Data[]>([]);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// 返回未中奖的候选人
	const getAvailableParticipants = () => {
		const allWinners = getWinnersFromSession();
		return participants.filter(p => !allWinners.some(w => w.phone === p.phone));
	};

	const startDraw = () => {
		setIsDrawing(true);
		intervalRef.current = setInterval(() => {
			const candidates = getAvailableParticipants();
			if (candidates.length < 5) {
				setWinners(candidates);
				return;
			}
			const indices = Array.from(new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * candidates.length))));
			while (indices.length < 5) {
				const idx = Math.floor(Math.random() * candidates.length);
				if (!indices.includes(idx)) indices.push(idx);
			}
			const randomParticipants = indices.map(i => candidates[i]);
			setWinners(randomParticipants);
		}, 50);
	};

	const nextDraw = () => {
		setIsDrawing(true);
		intervalRef.current = setInterval(() => {
			const allWinners = getWinnersFromSession();
			const firstRoundWinners = winners.slice(0, 5);
			const candidates = participants.filter(p => !allWinners.some(w => w.phone === p.phone) && !firstRoundWinners.some(w => w.phone === p.phone));
			if (candidates.length < 5) {
				setWinners([...firstRoundWinners, ...candidates]);
				return;
			}
			const indices = Array.from(new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * candidates.length))));
			while (indices.length < 5) {
				const idx = Math.floor(Math.random() * candidates.length);
				if (!indices.includes(idx)) indices.push(idx);
			}
			const randomParticipants = indices.map(i => candidates[i]);
			setWinners([...firstRoundWinners, ...randomParticipants]);
		}, 50);
	};

	const stopDraw = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setIsDrawing(false);
		// 把新中奖的加入sessionStorage
		const sessionWinners = getWinnersFromSession();
		const sessionPhones = sessionWinners.map(w => w.phone);
		const newWinners = winners.filter(w => !sessionPhones.includes(w.phone));
		if (newWinners.length) {
			saveWinnersToSession([...sessionWinners, ...newWinners]);
		}
	};

	useEffect(() => {
		return () => {
			stopDraw();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className='section'>
			<div className='section-header'>
				<h2 className='section-title'>抽取 10 位 SVIP 会员</h2>
				<p className='section-subtitle'>每轮抽取 5 位获奖者 共2轮</p>
			</div>

			<div className='card card-blue'>
				{!!winners.length && (
					<div className='number-grid'>
						{winners.map((participant, index) => {
							const shouldAnimate = isDrawing && (winners.length / 2 === 1 ? index < 5 : index >= 5);

							return (
								<motion.div
									key={index}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className='number-box number-box-blue'
								>
									<motion.div
										animate={
											shouldAnimate
												? {
														scale: [1, 1.1, 1],
														transition: { repeat: Infinity, duration: 0.5 },
													}
												: {}
										}
										className='name-text'
									>
										{participant.name}
									</motion.div>
									<motion.div
										animate={
											shouldAnimate
												? {
														scale: [1, 1.05, 1],
														transition: { repeat: Infinity, duration: 0.5 },
													}
												: {}
										}
										className='number-text'
									>
										{participant.phone}
									</motion.div>
								</motion.div>
							);
						})}
					</div>
				)}

				{!isDrawing && winners.length === 0 && (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startDraw} className='button button-blue'>
						开始抽奖
					</motion.button>
				)}

				{!isDrawing && winners.length === 5 && (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextDraw} className='button button-blue'>
						下一轮
					</motion.button>
				)}

				{isDrawing && (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopDraw} className='button button-red'>
						停止
					</motion.button>
				)}
			</div>
		</motion.div>
	);
}

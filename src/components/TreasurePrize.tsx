import type { Data } from '@/global.utils';
import { motion } from 'framer-motion';
import { getWinnersFromSession, saveWinnersToSession } from '@/global.utils';

export default function TreasurePrize({ participants }: { participants: Data[] }) {
	const [isDrawing, setIsDrawing] = useState(false);
	const [winner, setWinner] = useState<Data | null>(null);
	const intervalRef = useRef<NodeJS.Timeout>(null);

	const getAvailableParticipants = () => {
		const allWinners = getWinnersFromSession();
		return participants.filter(p => !allWinners.some(w => w.phone === p.phone));
	};

	const startDraw = () => {
		setIsDrawing(true);
		intervalRef.current = setInterval(() => {
			const candidates = getAvailableParticipants();
			if (candidates.length === 0) {
				setWinner(null);
				return;
			}
			const randomIndex = Math.floor(Math.random() * candidates.length);
			setWinner(candidates[randomIndex]);
		}, 50);
	};

	const stopDraw = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsDrawing(false);
		if (winner) {
			const sessionWinners = getWinnersFromSession();
			if (!sessionWinners.some(w => w.phone === winner.phone)) {
				saveWinnersToSession([...sessionWinners, winner]);
			}
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
				<h2 className='section-title'>抽取 1 位 SVIP 会员 + 苹果手机</h2>
			</div>

			<div className='card card-orange'>
				{!!winner && (
					<motion.div
						initial={{
							scale: 0.8,
							opacity: 0,
						}}
						animate={{ scale: 1, opacity: 1 }}
						className='number-box number-box-orange'
					>
						<motion.div
							animate={
								isDrawing
									? {
											scale: [1, 1.1, 1],
											transition: { repeat: Infinity, duration: 0.5 },
										}
									: {}
							}
							className='name-text'
						>
							{winner.name}
						</motion.div>
						<motion.div
							animate={
								isDrawing
									? {
											scale: [1, 1.05, 1],
											transition: { repeat: Infinity, duration: 0.5 },
										}
									: {}
							}
							className='number-text'
						>
							{winner.phone}
						</motion.div>
					</motion.div>
				)}

				{isDrawing ? (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopDraw} className='button button-red'>
						停止
					</motion.button>
				) : (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startDraw} className='button button-orange'>
						{winner ? '人没在场？再抽一次' : '开始抽奖'}
					</motion.button>
				)}
			</div>
		</motion.div>
	);
}

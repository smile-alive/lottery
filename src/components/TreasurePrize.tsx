import { motion } from 'framer-motion';
import { WINNERS_SESSION_KEY } from '@/config/storage-key';
import { getItem, setItem } from '@/utils/local-storage';
import CardItem from './CardItem';

export default function TreasurePrize({ participants }: { participants: Data[] }) {
	const [isDrawing, setIsDrawing] = useState(false);
	const [winner, setWinner] = useState<Data | null>(null);
	const intervalRef = useRef<NodeJS.Timeout>(null);

	const getAvailableParticipants = () => {
		const allWinners = getItem<Data[]>(WINNERS_SESSION_KEY, { type: 'session' });
		return participants.filter(p => !allWinners?.some(w => w.phone === p.phone));
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
			const sessionWinners = getItem<Data[]>(WINNERS_SESSION_KEY, { type: 'session' }) ?? [];
			if (!sessionWinners.some(w => w.phone === winner.phone)) {
				setItem(WINNERS_SESSION_KEY, [...sessionWinners, winner], { type: 'session' });
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
				<p className='section-subtitle'>iPhone17为白色基础款，直接发放，无法代领</p>
			</div>

			<div className='card'>
				{!!winner && <CardItem showAnimate={isDrawing} {...winner} style={{ width: '30vw' }} />}

				{isDrawing ? (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopDraw} className='button'>
						停止
					</motion.button>
				) : (
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startDraw} className={clsx(['button', { again: winner }])}>
						{winner ? '人没在场？再抽一次' : '开始抽奖'}
					</motion.button>
				)}
			</div>
		</motion.div>
	);
}

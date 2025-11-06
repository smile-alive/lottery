import { Activity, Suspense, use } from 'react';
import AdventurePrize from '@/components/AdventurePrize';
import Loading from '@/components/Loading';
import TreasurePrize from '@/components/TreasurePrize';

export const fetchData = async () => {
	try {
		const [response] = await Promise.all([fetch('/admin/api/cy_10_years_checkin/export'), new Promise(resolve => setTimeout(resolve, 1000))]);

		if (!response.ok) {
			throw new Error(`HTTP 错误：${response.status}`);
		}

		const data: ApiResponse = await response.json();

		if (!data.success) {
			throw new Error(data.error?.message || '请求失败');
		}

		return data.records || [];
	} catch (err) {
		console.error('❌ fetchData 失败:', err);
		throw err instanceof Error ? err : new Error('未知错误');
	}
};

function Setup({ promise }: { promise: ReturnType<typeof fetchData> }) {
	const [activeTab, setActiveTab] = useState('adventure');

	const result = use(promise);

	return (
		<div className='container'>
			<div className='tab-buttons'>
				<button className={clsx(['tab-button', { active: activeTab === 'adventure' }])} onClick={() => setActiveTab('adventure')}>
					探险奖
				</button>
				<button className={clsx(['tab-button', { active: activeTab === 'treasure' }])} onClick={() => setActiveTab('treasure')}>
					夺宝奖
				</button>
			</div>

			<div className='content-area'>
				<Activity mode={activeTab === 'adventure' ? 'visible' : 'hidden'}>
					<AdventurePrize participants={result} />
				</Activity>
				<Activity mode={activeTab === 'treasure' ? 'visible' : 'hidden'}>
					<TreasurePrize participants={result} />
				</Activity>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<Suspense fallback={<Loading />}>
			<Setup promise={fetchData()} />
		</Suspense>
	);
}

import './Designers.css'

import { Service } from '../../service/service'

import { IDesignerFromApi } from '../../models/models';

import DesignersRow from '../../components/DesignerRow/DesignerRow';
import Header from '../../components/Header/Header'

import { useEffect, useState } from 'react';

function Designers() {

    const service = Service.getInstance();

    const [designersData, setdesignersData] = useState<IDesignerFromApi[]>([]);
    const [loadingDesignersData, setLoadingDesignersData] = useState<boolean>(true);
    const [errorDesignersData, setErrorDesignersData] = useState<string | null>(null);

    useEffect(() => {
        const fetchDesignersData = async () => {
            try {
                const stats = await service.getDesigners();
                setdesignersData(stats);
            } catch (err) {
                setErrorDesignersData('Невозможно подключиться к серверу');
            } finally {
                setLoadingDesignersData(false);
            }
        };

        fetchDesignersData();
    }, []);

    if (loadingDesignersData) {
        return <div>Loading...</div>;
    }

    if (errorDesignersData) {
        return <div>{errorDesignersData}</div>;
    }

    return (
        <>
            <div className="container">
                <Header />
                <div className='search-box'>
                    <input type="search" name="" id="" placeholder="Поиск по имени..."/>
                    <input type="search" name="" id="" placeholder="Поиск по имени..."/>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Аватар</th>
                            <th scope="col">Имя дизайнера</th>
                            <th scope="col">Почта</th>
                            <th scope="col">Закрытые задачи</th>
                            <th scope="col">Задачи в процессе</th>
                        </tr>
                    </thead>
                    <tbody>
                        {designersData.map(designerInfo =>
                            <DesignersRow {...designerInfo} />)}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Designers
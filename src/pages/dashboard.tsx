import DateRange from "@/components/DateRange";
import { useState } from "react";

const Dashboard = () => {
    const [date, setDate] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null,
    });
    return (
        <div>
            <DateRange setDate={setDate} />
        </div>
    );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';

const SecurityLogsView = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/logs')
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                {log.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.user}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {log.details}
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500 text-sm">No logs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SecurityLogsView;

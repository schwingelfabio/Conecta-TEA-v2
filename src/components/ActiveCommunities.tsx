import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface StateCount {
  state: string;
  count: number;
}

const ActiveCommunities: React.FC = () => {
  const [data, setData] = useState<StateCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const counts: Record<string, number> = {};

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.state) {
            counts[userData.state] = (counts[userData.state] || 0) + 1;
          }
        });

        const sortedData = Object.entries(counts)
          .map(([state, count]) => ({ state, count }))
          .sort((a, b) => b.count - a.count);

        setData(sortedData);
      } catch (err) {
        console.error("Error fetching user counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 animate-pulse">
        <p className="text-slate-400 font-medium">Carregando comunidades ativas...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Comunidades Ativas</h3>
        <p className="text-slate-500">As comunidades começarão a aparecer conforme novos usuários se conectarem.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
        <Users size={20} className="text-brand-primary" />
        <span>Comunidades Ativas</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((item) => (
          <motion.div
            key={item.state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <div className="flex items-center space-x-3">
              <MapPin size={18} className="text-brand-primary" />
              <span className="font-bold text-slate-900">{item.state}</span>
            </div>
            <span className="text-sm font-medium text-slate-600">- {item.count} famílias</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActiveCommunities;

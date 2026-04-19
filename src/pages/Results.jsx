import React from 'react';
import { motion } from 'framer-motion';

export default function Results({ data, name }) {
  // Fallback in case the API failed or returned malformed data
  if (!data || !data.scores) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl text-error mb-4">Evaluation Processing Failed</h2>
        <pre className="text-xs text-text-muted text-left bg-background-secondary p-4 rounded-lg w-full max-w-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  const { scores, overall_recommendation, summary } = data;

  // Helper to color-code the recommendation
  const getRecColor = (rec) => {
    if (rec?.includes('Hire')) return 'text-stat-success bg-stat-success/10 border-stat-success/20';
    if (rec?.includes('Reject')) return 'text-error bg-error/10 border-error/20';
    return 'text-stat-warning bg-stat-warning/10 border-stat-warning/20';
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold mb-2">Evaluation Rubric</h1>
        <p className="text-text-muted">Candidate: <span className="text-text-primary font-medium">{name}</span></p>
      </motion.div>

      {/* Top Banner: Recommendation & Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background-secondary border border-border rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
      >
        <div className="flex-1">
          <h3 className="text-sm font-mono tracking-widest text-text-muted uppercase mb-2">AI Summary</h3>
          <p className="text-lg text-text-primary leading-relaxed">"{summary}"</p>
        </div>
        <div className={`px-6 py-3 rounded-xl border text-lg font-bold tracking-wide ${getRecColor(overall_recommendation)}`}>
          {overall_recommendation}
        </div>
      </motion.div>

      {/* Grid: Skill Scores & Evidence */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(scores).map(([skill, details], idx) => (
          <motion.div 
            key={skill}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold capitalize text-accent-hover">{skill}</h3>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background-primary border border-border font-bold text-lg">
                {details.score}<span className="text-xs text-text-muted">/5</span>
              </div>
            </div>
            
            <p className="text-sm text-text-primary mb-4 flex-1">
              {details.feedback}
            </p>
            
            <div className="mt-auto pt-4 border-t border-border">
              <p className="text-xs font-mono uppercase text-text-muted mb-2">Quote Evidence:</p>
              <p className="text-sm italic text-text-secondary border-l-2 border-accent-tertiary pl-3">
                "{details.quote}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
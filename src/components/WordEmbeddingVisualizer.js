import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import * as d3 from 'd3';

const WordEmbeddingVisualizer = ({ words, wordVectors }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!words.length || !wordVectors) return;

        // Project high-dimensional vectors to 2D using PCA
        const vectors = words.map(word => wordVectors.get(word));
        const projection = projectTo2D(vectors);

        // Create visualization
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = 400;
        const height = 300;
        const margin = 40;

        const xScale = d3.scaleLinear()
            .domain(d3.extent(projection, d => d[0]))
            .range([margin, width - margin]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(projection, d => d[1]))
            .range([height - margin, margin]);

        // Add points
        svg.selectAll('circle')
            .data(projection)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', 5)
            .attr('fill', '#1976d2')
            .attr('opacity', 0.6);

        // Add labels
        svg.selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .attr('x', (_, i) => xScale(projection[i][0]))
            .attr('y', (_, i) => yScale(projection[i][1]) - 10)
            .text(d => d)
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle');

        // Add axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin})`)
            .call(xAxis);

        svg.append('g')
            .attr('transform', `translate(${margin},0)`)
            .call(yAxis);

    }, [words, wordVectors]);

    return (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Word Embeddings Visualization
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    style={{ maxWidth: '100%' }}
                />
            </Box>
        </Paper>
    );
};

// Simple PCA-like projection to 2D
function projectTo2D(vectors) {
    // Center the vectors
    const mean = vectors[0].map((_, i) => 
        vectors.reduce((sum, v) => sum + v[i], 0) / vectors.length
    );
    
    const centered = vectors.map(v => 
        v.map((val, i) => val - mean[i])
    );

    // Compute covariance matrix
    const n = vectors[0].length;
    const cov = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            cov[i][j] = centered.reduce((sum, v) => sum + v[i] * v[j], 0) / vectors.length;
        }
    }

    // Get first two principal components
    const [pc1, pc2] = getPrincipalComponents(cov);

    // Project data onto principal components
    return centered.map(v => [
        v.reduce((sum, val, i) => sum + val * pc1[i], 0),
        v.reduce((sum, val, i) => sum + val * pc2[i], 0)
    ]);
}

// Power iteration method to find principal components
function getPrincipalComponents(cov, numComponents = 2) {
    const n = cov.length;
    const components = [];

    for (let k = 0; k < numComponents; k++) {
        let vector = Array(n).fill().map(() => Math.random());
        let prevVector;

        // Power iteration
        for (let i = 0; i < 100; i++) {
            prevVector = [...vector];
            vector = cov.map(row => 
                row.reduce((sum, val, j) => sum + val * prevVector[j], 0)
            );
            
            // Normalize
            const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
            vector = vector.map(val => val / norm);

            // Orthogonalize with previous components
            for (let j = 0; j < k; j++) {
                const proj = vector.reduce((sum, val, i) => sum + val * components[j][i], 0);
                vector = vector.map((val, i) => val - proj * components[j][i]);
            }
        }

        components.push(vector);
    }

    return components;
}

export default WordEmbeddingVisualizer; 
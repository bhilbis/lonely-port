"use client"
import React from 'react';
import { ProjectProvider } from '@/context/project-context';
import FilterToggle from './filter-toggle';
import FilterSection from './filter-section';
import ProjectInfo from './project-info';
import ProjectVisual from './project-visual';
import ProjectControls from './project-control';
import CollaborationCTA from './collab-cta';

const ProjectsSection = () => {
  return (
    <ProjectProvider>
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10">
          <FilterToggle />
          <FilterSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-16">
            <ProjectInfo />
            <ProjectVisual />
          </div>
          
          <ProjectControls />
          <CollaborationCTA />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default ProjectsSection;

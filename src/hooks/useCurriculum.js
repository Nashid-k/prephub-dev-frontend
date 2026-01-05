import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { curriculumAPI } from '../services/api';

/**
 * Hook to fetch topics with caching based on experience level
 * @param {Object} params - { experienceLevel, isPersonalized }
 */
export const useTopics = ({ experienceLevel, isPersonalized }) => {
    return useQuery({
        queryKey: ['topics', { experienceLevel, isPersonalized }],
        queryFn: async () => {
            const params = { experienceLevel };
            const response = isPersonalized
                ? await curriculumAPI.getPersonalizedTopics(params)
                : await curriculumAPI.getAllTopics(params);

            // Return the data directly for easier usage
            return response.data; // Expecting { success: true, topics: [], ... }
        },
        staleTime: 1000 * 60 * 10, // 10 minutes cache for topic list
        keepPreviousData: true, // Keep showing old list while fetching new one
    });
};

/**
 * Hook to fetch a single topic by slug
 */
export const useTopic = (slug) => {
    return useQuery({
        queryKey: ['topic', slug],
        queryFn: async () => {
            const response = await curriculumAPI.getTopicBySlug(slug);
            return response.data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 30, // 30 mins
    });
};

/**
 * Hook to fetch section content
 */
export const useSection = (topicSlug, sectionSlug) => {
    return useQuery({
        queryKey: ['section', topicSlug, sectionSlug],
        queryFn: async () => {
            const response = await curriculumAPI.getSectionBySlug(topicSlug, sectionSlug);
            return response.data;
        },
        enabled: !!topicSlug && !!sectionSlug,
        staleTime: 1000 * 60 * 60, // 1 hour cache for static content
    });
};

/**
 * Hook to fetch aggregated section data (Topic + Category + Section + Siblings)
 */
export const useSectionAggregate = (topicSlug, sectionSlug) => {
    return useQuery({
        queryKey: ['section-aggregate', topicSlug, sectionSlug],
        queryFn: async () => {
            const response = await curriculumAPI.getSectionAggregate(topicSlug, sectionSlug);
            return response.data;
        },
        enabled: !!topicSlug && !!sectionSlug,
        staleTime: 1000 * 60 * 60, // 1 hour
        keepPreviousData: true,
    });
};

/**
 * Hook to optimistically mark section as complete
 */
export const useMarkSectionComplete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ topicSlug, sectionSlug }) => {
            // Assume API exists: POST /api/progress/complete
            // If utilizing specific API method, import it. 
            // For now using generic post via updated API or placeholder
            const { api } = await import('../services/api');
            return api.post('/progress/complete', { topicSlug, sectionSlug });
        },
        onMutate: async ({ topicSlug, sectionSlug }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(['section-aggregate', topicSlug, sectionSlug]);

            // Snapshot previous value
            const previousData = queryClient.getQueryData(['section-aggregate', topicSlug, sectionSlug]);

            // Optimistically update to new value
            if (previousData && previousData.section) {
                queryClient.setQueryData(['section-aggregate', topicSlug, sectionSlug], {
                    ...previousData,
                    section: {
                        ...previousData.section,
                        isCompleted: true // 100x Speed: Instant Checkmark
                    }
                });
            }

            return { previousData };
        },
        onError: (err, newTodo, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['section-aggregate', newTodo.topicSlug, newTodo.sectionSlug],
                    context.previousData
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to be safe
            queryClient.invalidateQueries(['section-aggregate', variables.topicSlug, variables.sectionSlug]);
            queryClient.invalidateQueries(['topics']); // Update progress bars
        },
    });
};
